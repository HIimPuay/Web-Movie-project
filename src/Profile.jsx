//Profile

import Footer from './components/Footer.jsx';
import Navbar from './components/Navbar.jsx';
import UserProfile from './components/UserProfile.jsx';

function Profile() {
    return (
    <div className='landing'>
        <Navbar />
        <UserProfile />
        <Footer />
    </div>
    )
}

export default Profile;