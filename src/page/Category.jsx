import React from 'react';
import '../App.css';
import Footer from "../components/Footer";
import MovieCategory from "../components/MovieCategory";

function Category() {
    return (
        <div className='landing'>
            {/* แสดงแต่ละหมวดหมู่ */}
            <MovieCategory category="action" />
            <MovieCategory category="romance" />
            <MovieCategory category="comedy" />
            <MovieCategory category="drama" />
            <MovieCategory category="horror" />
            
            <Footer />
        </div>
    );
}

export default Category;
