use std::sync::mpsc;
use std::time::Duration;

use block2::RcBlock;
use chrono::{Local, NaiveDateTime, TimeZone};
use objc2::rc::Retained;
use objc2::runtime::Bool;
use objc2_event_kit::EKEventStore;
use objc2_foundation::{NSDate, NSError};

use super::CalendarEvent;
use crate::fs::StorageError;

fn naive_to_nsdate(naive: NaiveDateTime) -> Retained<NSDate> {
    let secs = Local
        .from_local_datetime(&naive)
        .single()
        .map(|dt| dt.timestamp() as f64)
        .unwrap_or(0.0);
    NSDate::dateWithTimeIntervalSince1970(secs)
}

fn nsdate_to_iso(date: &NSDate) -> String {
    let secs = date.timeIntervalSince1970() as i64;
    Local
        .timestamp_opt(secs, 0)
        .single()
        .map(|dt| dt.format("%Y-%m-%dT%H:%M:%S").to_string())
        .unwrap_or_default()
}

/// Fetch the day's events from Apple Calendar (read-only), requesting access if needed.
pub fn fetch_events(
    start: NaiveDateTime,
    end: NaiveDateTime,
) -> Result<Vec<CalendarEvent>, StorageError> {
    unsafe {
        let store = EKEventStore::new();

        let (tx, rx) = mpsc::channel::<bool>();
        let handler = RcBlock::new(move |granted: Bool, _error: *mut NSError| {
            let _ = tx.send(granted.as_bool());
        });
        store.requestFullAccessToEventsWithCompletion(&*handler as *const _ as *mut _);
        let granted = rx.recv_timeout(Duration::from_secs(60)).unwrap_or(false);
        if !granted {
            return Err(StorageError::Calendar(
                "calendar access not granted".to_string(),
            ));
        }

        let start_date = naive_to_nsdate(start);
        let end_date = naive_to_nsdate(end);
        let predicate =
            store.predicateForEventsWithStartDate_endDate_calendars(&start_date, &end_date, None);
        let events = store.eventsMatchingPredicate(&predicate);

        let mut out = Vec::new();
        for event in events.iter() {
            out.push(CalendarEvent {
                title: event.title().to_string(),
                start: nsdate_to_iso(&event.startDate()),
                end: nsdate_to_iso(&event.endDate()),
                all_day: event.isAllDay(),
                calendar: event
                    .calendar()
                    .map(|c| c.title().to_string())
                    .unwrap_or_default(),
            });
        }
        out.sort_by(|a, b| a.start.cmp(&b.start));
        Ok(out)
    }
}
