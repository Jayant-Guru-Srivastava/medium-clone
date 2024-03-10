import { Auth } from "../components/Auth";
import { Quote } from "../components/Quote";

export function Signin(){
    return(
        <div className="lg:grid grid-cols-2">
            <div>
                <Auth type="signin"/>
            </div>
            <div className="invisible lg:visible">
                <Quote />
            </div>
        </div>
    )
}