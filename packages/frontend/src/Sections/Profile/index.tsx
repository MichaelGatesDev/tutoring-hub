import React, { Component } from "react";
import "./style.scss";
import loadingIcon from "../../Assets/loading-icon.png";
import tutorSince from "../../Assets/tutor-since-img.svg";

import reviewsCount from "../../Assets/reviews-count.svg";
import reviewsNegative from "../../Assets/reviews-negative.svg";
import reviesPositive from "../../Assets/reviews-positive.svg";

import { Link } from "react-router-dom";

// Import components
import NavBar from "../../Components/NavBar";
import Title from "../../Components/Title";
import Stats from "../../Components/Stats";
import Course from "../../Components/Course";
import RatingCard from "../../Components/RatingCard";
import Subheading from "../../Components/Subheading";
import ReviewCard from "../../Components/ReviewCard";
import NoReviews from "../../Assets/no-reviews.png";
import FormDropdown from "../../Components/FormDropdown";
import FormSlider from "../../Components/FormSlider";


interface Props {

}

interface State {
	tutor: any;
	loading: boolean;
	yes: number;
	no: number;
	filterCourse: string;
	filterRating: number;
	filterRatingType: string;
}

export default class Profile extends Component<Props, State> {

	constructor(props: Props) {
		super(props);
		this.state = {
			tutor: {},
			loading: true,
			yes: 0,
			no: 0,
			filterCourse: "",
			filterRating: 0,
			filterRatingType: "",
		};
		this.getName = this.getName.bind(this);
	}

	getName() {
		return this.state.tutor.firstName + " " + this.state.tutor.lastName;
	}

	getBookAgain = (reviews: any[], answer: any) => {
		let filtered;
		const book = reviews.map(review => {
			return review.bookAgain;
		});
		if (answer === 1) {
			filtered = book.filter(b => {
				return b === true;
			});
			return 100 / (book.length / filtered.length);
		} else {
			filtered = book.filter(b => {
				return b === false;
			});
			return 100 / (book.length / filtered.length);
		}
	};

	filterCourses = (course: any) => {
		this.setState({
			filterCourse: course === "" ? "" : course
		});
	};

	filterRatings = (rating: number) => {
		this.setState({
			filterRating: rating
		});
	};

	filterRatingsType = (type: string) => {
		this.setState({
			filterRatingType: type
		});
	};

	componentDidMount() {
		window.scrollTo(0, 0);

		fetch(`/api/v1${window.location.pathname}`)
			.then(response => response.json())
			.then(data => {
				this.setState({
					tutor: data,
					yes: this.getBookAgain(data.reviews, 1),
					no: this.getBookAgain(data.reviews, 0),
					loading: false
				});
			})
			.catch(error => {
				console.log(error);
			});
	}

	render() {

		return (
			<div className="profile-section">
				<NavBar />
				{this.state.loading ? (
					<div className="profile-section--wrapper">
						<div className="profile-section--wrapper-load">
							<img
								className={"profile-section--wrapper__loading"}
								src={loadingIcon}
								alt=""
							/>
						</div>
					</div>
				) : (
						<div className="profile-section--wrapper">
							<div className="profile-section--wrapper__upper">
								<div className={"profile-section--wrapper__upper--left"}>
									<img src={this.state.tutor.imageUrl} alt="" />
								</div>
								<div className={"profile-section--wrapper__upper--center"}>
									<Title title={this.getName()} />
									<p className="profile-major">{this.state.tutor.major}</p>

									<div className={"tutor-since"}>
										<img src={tutorSince} alt="tutor since" />
										<p>Tutor since {this.state.tutor.since.substr(5) +
											" " +
											this.state.tutor.since.substr(0, 4)}
										</p>
									</div>
									<section className={"tutor-rating-stats"}>
										<div className={"tutor-rating-stats--reviews"}>
											<img src={reviewsCount} alt="total reviews" />
											<p>
												<span>{this.state.tutor.reviews.length} </span>Total
												Reviews
										</p>
										</div>
										<div className={"tutor-rating-stats--positive"}>
											<img src={reviesPositive} alt="positive reviews" />
											{isNaN(parseFloat(this.state.yes.toFixed(1))) ? (
												<p>N/A</p>
											) : (
													<p>
														<span>{this.state.yes.toFixed(1)} % </span>would book
														again
											</p>
												)}
										</div>
										<div className={"tutor-rating-stats--negative"}>
											<img src={reviewsNegative} alt="negative reviews" />
											{isNaN(parseFloat(this.state.no.toFixed(1))) ? (
												<p>N/A</p>
											) : (
													<p>
														<span>{this.state.no.toFixed(1)} % </span>wouldn't book
														again
											</p>
												)}
										</div>
									</section>
								</div>
								<div className={"profile-section--wrapper__upper--right"}>
									<RatingCard reviews={this.state.tutor.reviews} />
								</div>
							</div>
							<Subheading title={"Courses"} />
							<Course courses={this.state.tutor.courses} />
							<Subheading title={"Stats"} />
							<Stats reviews={this.state.tutor.reviews} />
							<div className={"profile-section--wrapper__reviews"}>
								<Subheading title={"Reviews"} />
							</div>
							<div className="Filters-course">
								<div>
									<span>Filters review</span>
									<FormDropdown
										title={"Courses"}
										options={this.state.tutor.courses}
										onChange={this.filterCourses}
										value={this.state.filterCourse}
										uppercase={true}
									/>
								</div>
								<Link
									to={`/tutors/${this.state.tutor._id}/rate`}
									onClick={() => {
										document.getElementById("navbar")!.scrollIntoView();
									}}
								>
									REVIEW {this.getName().toUpperCase()}
								</Link>
							</div>
							{this.state.tutor.reviews.length === 0 ? (
								<div className={"profile-section--wrapper__no-reviews"}>
									<img src={NoReviews} alt="" />
									<h3>
										{this.state.tutor.firstName} doesn't have any reviews yet. Be
										the first to review
								</h3>
								</div>
							) : (
									<ReviewCard
										tutor={this.state.tutor}
										filterCourse={this.state.filterCourse}
									/>
								)}
						</div>
					)}
			</div>
		);
	}
}