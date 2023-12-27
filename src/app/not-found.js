import Link from 'next/link'
import componentStyles from "./page.module.css";

const NotFound = () => (
    <div className={`${componentStyles.notfound} flex-row flex-justify-between flex-align-center`} >
        <h5>404</h5>
        <small>|</small>
        <h5>Unfortunately Page Not Found!</h5>
        <Link href="/dashboard">Return</Link>
    </div >
)
export default NotFound;