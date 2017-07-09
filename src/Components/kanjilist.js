import React, { Component } from 'react';
import KanjiSet from './kanjiset';
import store from 'store2';

export default class KanjiList extends Component {
	constructor(props) {
		super(props);
		this.state = {set: store.get("setNumber") || 1};
		this.updateSet = this.updateSet.bind(this);
	}

	updateSet(event) {
		const attemptedCast = Number(event.target.value);
		const value = Number.isInteger(attemptedCast) && attemptedCast > 0 ? attemptedCast : '';
		this.setState({set: value})
		store.set("setNumber", value);
	}

	render() {
		return (
			<div>
				<div className="rows">
					<input name="set" className="setInput" placeholder="set #" value={this.state.set} onChange={this.updateSet}/>
				</div>
				<KanjiSet set={this.state.set} />
			</div>
		);
	}
}