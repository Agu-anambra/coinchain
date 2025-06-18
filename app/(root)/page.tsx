import { Button } from "@/components/ui/button";
import { investmentPlans } from "@/constants";
import Image from "next/image";
import Landing from "@/components/Landing";
import InvestmentPlans from "@/components/InvestmentPlans";
import {db} from "@/database/drizzle"
import {users} from "@/database/schema"

const Home = async () => {
const cover =  "/assets/images/COINCHAIN.png"
  // const result = await db.select().from(users);
  // console.log(JSON.stringify(result, null, 2))
  return(
  <>
    <Landing cover={cover}/>

    {/* <InvestmentPlans
      title="Investment Plans"
      plans={investmentPlans}
      containerClassName="mt-28"
    /> */}
  </>
  )
}
;

export default Home;
