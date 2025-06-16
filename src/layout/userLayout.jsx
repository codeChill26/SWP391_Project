import Footer from "../components/Footer"
import Navbar from "../components/Navbar"

export const UserLayout = (props) => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="pt-24 px-4 sm:px-6 lg:px-8">
                {props.children}
            </div>
            <Footer />
        </div>
    )
}