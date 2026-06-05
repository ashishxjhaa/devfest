import Eventcard from "@/components/Eventcard";
import ExploreBtn from "@/components/ExploreBtn";
import { events } from "@/lib/constants";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export interface IEvent {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const Page = async () => {
  // const response = await fetch(`${BASE_URL}/api/events`);
  // const { events } = await response.json();

  return (
    <section>
      <h1 className="text-center ">
        The Hub for Every Dev <br /> Event You Can't Miss
      </h1>
      <p className="text-center mt-5">
        Hackathons, Meetups, and Conferences, All in one place
      </p>

      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>

        <ul className="events list-none">
          {events &&
            events.length > 0 &&
            events.map((event: IEvent) => (
              <li key={event.title}>
                <Eventcard {...event} />
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
};

export default Page;
