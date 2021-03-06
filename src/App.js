import React, { useEffect, useState } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import Confirmation from "./components/Confirmation";
import Header from "./components/Header";
import Home from "./components/Home";
import Pizza from "./components/Pizza";
import * as yup from "yup";
import schema from "./validation/pizzaForm";
import Axios from "axios";

const initialFormValues = {
	// text inputs
	name: "",
	address: "",
	instructions: "",
	quantity: "",

	// dropdown
	size: "",

	// radio button
	sauce: "",
	"Original Ranch": false,
	"Garlic Ranch": false,
	"BBQ Sauce": false,
	"Spinach Alfredo": false,

	// checkboxes
	Pepperoni: false,
	Sausage: false,
	"Canadian Bacon": false,
	"Spicy Italian Sausage": false,
	"Grilled Chicken": false,
	Onions: false,
	"Green Pepper": false,
	"Diced Tomatoes": false,
	substitute: false,
};

const initialFormErrors = {
	name: "please enter your name",
	address: "please add an address",
	quantity: "please enter order quantity",
};

const App = () => {
	const [order, setOrder] = useState([]);
	const [formValues, setFormValues] = useState(initialFormValues);
	const [formErrors, setFormErrors] = useState(initialFormErrors);
	const [submitDisabled, setSubmitDisabled] = useState(true);

	const history = useHistory();

	//POST request triggered onSubmit
	const sendOrder = (newOrder) => {
		Axios.post("https://reqres.in/api/users", newOrder).then((res) => {
			setOrder([...order, res.data]);
			console.log(res.data);
		});
	};

	// onSubmit Function
	const submitHandler = (e) => {
		e.preventDefault();
		setFormValues({ ...formValues, [e.target.name]: e.target.value });
		sendOrder(formValues);
		history.push("/confirmation");
	};

	//onChange
	const onChangeHandler = (e) => {
		const { name, value, type, checked } = e.target;
		setFormValues({
			...formValues,
			[name]: type === "checkbox" ? checked : value,
		});
	};

	// this is the Validator for Name and Address required
	const validator = (name, value, type, checked) => {
		yup
			.reach(schema, name)
			.validate(value)
			.then(() => {
				setFormErrors({
					...formErrors,
					[name]: " ",
				});
			})
			.catch((err) => {
				setFormErrors({
					...formErrors,
					[name]: err.errors[0],
				});
			});
		setFormValues({
			...formValues,
			[name]: type === "checkbox" ? checked : value,
			// [name]: type === ("text" || "number") ? value : checked,
		});
	};

	// Submit button disable/enable
	useEffect(() => {
		schema.isValid(formValues).then((valid) => {
			setSubmitDisabled(!valid);
		});
	}, [formValues.name, formValues.address, formValues.quantity]);

	return (
		<div className="App">
			{/*Header is constant so it's not inside Switch */}
			<Header />

			{/* this area changes based on what user clicks to its wrapped inside Switch */}
			<Switch>
				<Route exact path="/">
					<Home />
				</Route>

				{/* PizzaForm page loads when CTA is clicked. Check CallToAction.js */}
				<Route path="/pizza">
					<Pizza
						formValues={formValues}
						submitHandler={submitHandler}
						onChangeHandler={onChangeHandler}
						validator={validator}
						formErrors={formErrors}
						submitDisabled={submitDisabled}
					/>
				</Route>

				<Route path="/confirmation">
					<Confirmation order={order} />
				</Route>
			</Switch>
		</div>
	);
};
export default App;
