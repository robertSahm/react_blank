import React from "react";
import img1 from "../img/image-1.jpg";
import { Link } from 'react-router-dom';


const Underwear = () =>
	<div className="col-12">
		<h3 className="text-center">Underwera</h3>
		<div className="col-12 col-md-4">
			<img className="img-fluid rounded" src={img1} alt="" />
		</div>
	</div>;

export default Underwear;
