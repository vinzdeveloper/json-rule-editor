import React, { useState } from 'react';
import PropTypes from 'prop-types';
import InputField from '../forms/input-field';
import Button from '../button/button';

const PageTitle = ({ name, titleFlag, onEdit }) => {
	const [editable, setEditable] = useState(false);
	const [rName, setRName] = useState(name);
	const onChangeName = (e) => {
		setRName(e.target.value);
	};
	return (
		<div className="page-title">
			{titleFlag && <TitleIcon />}
			<div>
				{!editable ? (
					<h1>
						{name}
						{onEdit && (
							<a
								style={{ marginLeft: 8 }}
								href=""
								onClick={(e) => {
									e.preventDefault();
									setEditable(true);
								}}
							>
								<span className="fa fa-edit" />
							</a>
						)}
					</h1>
				) : (
					<div className="add-field-panel-row" style={{ display: 'flex', alignItems: 'center' }}>
						<div>
							<InputField label="Name" onChange={onChangeName} value={rName} />
						</div>

						<Button
							label="Update"
							onConfirm={() => {
								onEdit(rName);
								setEditable(false);
							}}
							classname="primary-btn small-btn"
							// type="submit"
						/>
						<Button
							label="Cancel"
							onConfirm={() => setEditable(false)}
							classname="cancel-btn small-btn"
							// type="submit"
						/>
					</div>
				)}
			</div>
		</div>
	);
};

PageTitle.defaultProps = {
	name: '',
	classname: '',
	titleFlag: false
};

PageTitle.propTypes = {
	name: PropTypes.string,
	classname: PropTypes.string,
	titleFlag: PropTypes.bool,
	onEdit: PropTypes.func
};

export const TitleIcon = ({ iconClass }) => {
	return (
		<div className="icon-card">
			<span className={iconClass} />
		</div>
	);
};

TitleIcon.defaultProps = {
	iconClass: ''
};

TitleIcon.propTypes = {
	iconClass: PropTypes.string
};

export default PageTitle;
