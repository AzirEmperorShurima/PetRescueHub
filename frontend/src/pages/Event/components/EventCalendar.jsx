import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const EventCalendar = ({ events }) => {
  // Chuyển đổi dữ liệu sự kiện sang định dạng react-big-calendar
  const calendarEvents = events
    .filter(e => e)
    .map(event => ({
      id: event._id,
      title: event.title,
      start: new Date(event.startDate || event.startAt || event.createdAt),
      end: new Date(event.endDate || event.endAt || event.createdAt),
      allDay: false,
      resource: event
    }));

  return (
    <div style={{ height: 600 }}>
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        titleAccessor="title"
        style={{ height: 600 }}
        popup
        views={['month', 'week', 'day', 'agenda']}
        messages={{
          month: 'Tháng',
          week: 'Tuần',
          day: 'Ngày',
          agenda: 'Danh sách',
          today: 'Hôm nay',
          previous: 'Trước',
          next: 'Sau',
        }}
      />
    </div>
  );
};

export default EventCalendar; 