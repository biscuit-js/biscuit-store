import React, { useState } from 'react';
import './styles.css';

export function Pagger({ data }) {
	const [offset, setOffset] = useState(0);

	const handleOffset = (value) => {
		setOffset(value);
	};

	return (
		<div className='pagger'>
			<div className='paggerButtons'>
				{data.map(({ title, value }, i) => (
					<div
						className={offset === value ? 'active' : ''}
						onClick={() => handleOffset(value)}
						key={i}>
						{title}
					</div>
				))}
			</div>
			<div className='paggerFrame'>
				<div style={{ transform: `translateY(-${offset}px)` }}>
					{data.map(({ target }, i) => (
						<div key={i}>{target}</div>
					))}
				</div>
			</div>
		</div>
	);
}
