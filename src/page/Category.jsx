import React from 'react';
import '../App.css';
import Footer from "../components/Footer";
import MovieCategory from "../components/MovieCategory";

function Category() {
    const categories = ["action", "romance", "comedy", "drama", "horror"];

    return (
        <div className="landing">
            {/* Map through categories and display MovieCategory component for each one */}
            {categories.map((category, index) => (
                <MovieCategory key={index} category={category} />
            ))}

            <Footer />
        </div>
    );
}

export default Category;
