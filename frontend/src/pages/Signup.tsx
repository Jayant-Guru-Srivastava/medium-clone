import { Auth } from "../components/Auth";
import { Quote } from "../components/Quote";

export function Signup(){
    return(
        <div className="lg:grid grid-cols-2">
            <div>
                <Auth type="signup"/>
            </div>
            <div className="invisible lg:visible">
                <Quote />
            </div>
        </div>
    )
}