import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { del, get } from "util/ajax";

interface EventType {
  id: number;
  eventType: string;
  eventTitle: string;
  eventMessage: string;
  createAt: Date;
}

const Event = () => {
  const navigate = useNavigate();

  const [eventList, setEventList] = useState<EventType[]>([]);

  get(`${process.env.REACT_APP_BACKEND_URL}/event`, {}, (data: BackendResponseData<EventType[]>) => {
    const resEventList = data.data?.map((item) => { item.createAt = new Date(item.createAt); return item })
    setEventList(resEventList ?? []);
  });

  const deleteEvent = (id: number) => {
    del(`${process.env.REACT_APP_BACKEND_URL}/event/${id}`, {}, (data: BackendResponseData) => {
      if(data.message === "success") {
        navigate(0);
      }
    });
  }

  return (
    <div>
      <div className="container">
        {eventList.length > 0 ? (
          eventList.map((item, idx) => {
            const title = item.eventTitle;
            const message = item.eventMessage;
            return <div className="row mb-1" key={idx}>
              <div className="col">{item.createAt.toDateString()}</div>
              <div className="col">
                <span>{title}</span>
                <span>{message}</span>
              </div>
              <div className="col" onClick={() => { deleteEvent(item.id) }}>
                <span>삭제</span>
              </div>
            </div>
          })
        ) : (
          <div className="row" key={0}>
            <p className="col">이용내역/알림이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Event;