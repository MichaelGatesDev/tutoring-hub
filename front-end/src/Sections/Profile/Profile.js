import React, { Component } from 'react';
import './Profile.css';
import loadingIcon from '../../Assets/loading-icon.png';
import {Link} from 'react-router-dom';

// Import components
import NavBar from '../../Components/NavBar/NavBar';
import Title from '../../Components/Title/Title';
import Stats from '../../Components/Stats/Stats';
import Course from '../../Components/Course/Course';
import RatingCard from '../../Components/RatingCard/RatingCard';
import Subheading from '../../Components/Subheading/Subheading';
import ReviewCard from '../../Components/ReviewCard/ReviewCard';

import testImage from '../../Assets/gaurav-img-test.png';
import testImage2 from '../../Assets/swornim-img-test.jpg';
import testImage3 from '../../Assets/tran-img-test.jpg';
import testImage4 from '../../Assets/michelle-img-test.jpg';

class Profile extends Component {
    state = {
        name: "",
        courses: [],
        isLoading: true,
        reviews: [],
        major: "",
        since: "",
        yes: 0,
        no: 0
    }

    getBookAgain = (reviews, answer) => {
        console.log("FROM FUNCT");
        let filtered;
        const book = reviews.map( review => {
            return review.bookAgain;
        });
        if (answer === 1) {
            filtered = book.filter(b => {
                return b === true;
            }) 
            return (100 / (book.length / filtered.length));
        } else {
            filtered = book.filter(b => {
                return b === false;
            }) 
            return (100 / (book.length / filtered.length));
        }
    }

    componentDidMount() {
        fetch(`http://137.142.172.24:3001${window.location.pathname}`)
        .then(response => response.json())
        .then(data => {
            this.setState({
                name: `${data.firstName} ${data.lastName}`,
                courses: [...data.courses],
                reviews: [...data.reviews],
                major: data.major,
                since: data.since,
                isLoading: false,
                yes: this.getBookAgain(data.reviews, 1),
                no: this.getBookAgain(data.reviews, 0)
            });
        })
        .catch((error) => {
            console.log(error);
        }); 
    }

    render() {

        const getTutor = (name) => {
            if (name === "Tran Nguyen") return testImage3
            else if (name === "Swornim Barahi") return testImage2
            else if (name === "Michelle Bello") return testImage4

            else {
                return testImage
            }
        }
        return (
            <div className="profile-section">
                <NavBar/>  
                {
                    this.state.isLoading ?
                    <div className="profile-section--wrapper">
                        <div className="profile-section--wrapper-load">
                            <img className={"profile-section--wrapper__loading"} src={loadingIcon} alt=""/>
                        </div>
                    </div>  :
                    <div className="profile-section--wrapper">
                        <Title title = {this.state.name}/>
                        <div className="profile-section--wrapper__upper">
                            <div className={"profile-section--wrapper__upper--left"}>
                                <img src={getTutor(this.state.name)} alt=""/>
                            </div>
                            <div className={"profile-section--wrapper__upper--center"}>
                                <Subheading title={"Overview:"}/>
                                <p><span>MAJOR: </span>{this.state.major}</p>
                                <p><span>TUTOR SINCE: </span>{this.state.since}</p>
                                <p><span>REVIEWS: </span>{this.state.reviews.length}</p>
                                <p><span>WOULD BOOK AGAIN? :</span></p>
                                <div className={'profile-section--wrapper__book-again'}>
                                    <div>
                                        <p><span>YES</span> {this.state.yes.toFixed(1)} %</p>
                                    </div>  
                                    <div>
                                        <p><span>NO</span> {this.state.no.toFixed(1)} %</p>
                                    </div>
                                </div>
                                <Subheading title={"Courses:"}/>
                                <Course courses={this.state.courses}/>
                            </div>
                            <div className={"profile-section--wrapper__upper--right"}>
                                <RatingCard reviews={this.state.reviews}/>
                            </div>
                        </div>
                        <Subheading title={'Stats:'}/>
                        <Stats reviews={this.state.reviews}/>
                        <div className={'profile-section--wrapper__reviews'}>
                            <Subheading title={'Reviews:'}/>
                            <Link to={`${window.location.pathname}/rate`}>REVIEW {this.state.name.toUpperCase()}</Link>
                        </div>
                        <ReviewCard reviews={this.state.reviews} />
                    </div>
                }                
            </div>
        );
    }
}

export default Profile;
