import Head from "next/head";
import { MongoClient } from "mongodb";
import MeetupList from "../components/meetups/MeetupList";

// const DUMMY_MEETUPS = [
//   {
//     id: "m1",
//     title: "First Meetup",
//     image:
//       "https://media-exp1.licdn.com/dms/image/C4E1BAQGvXtm_dzZ_XQ/company-background_10000/0/1525884790498?e=2159024400&v=beta&t=6IWNf0TOln7y3UBJp_MauU88uawDk8xKqElHl-QEFXY",
//     address: "123",
//     description: "This is the first meetup",
//   },
//   {
//     id: "m2",
//     title: "Second Meetup",
//     image:
//       "https://pix10.agoda.net/hotelImages/3375/-1/f73547b49eadee36c6346f52a5b4f4fe.jpg?s=1024x768",
//     address: "456",
//     description: "This is the second meetup",
//   },
// ];

const HomePage = (props) => {
  return (
    <>
      <Head>
        <title>React Meetups</title>
        <meta
          name="description"
          content="Browse a huge list of highly active React meetups!"
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </>
  );
};

// export async function getServerSideProps(context) {
//   const req = context.req; //request
//   const res = context.res; //response

//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//   };
// }

export async function getStaticProps() {
  //fetch data
  const client = await MongoClient.connect(
    "mongodb+srv://admin:NextDB@cluster0.dc610.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find().toArray();
  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        description: meetup.description,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 5,
  };
}
export default HomePage;
