import React, { Component } from 'react';
import {List} from './kanji-data'

export default class KanjiSet extends Component {
	constructor(props) {
		super(props);
		this.renderRows = this.renderRows.bind(this);
		this.rows = this.renderRows();
	}

	shouldComponentUpdate(newProps) {
		return true;
	}

	renderRows() {
		const set = this.props.set;
		const setCount = 10;

		const withinSet = (setNum, index) => {
			const kanjiNum = index+1;
			return kanjiNum <= setNum * setCount && kanjiNum > (setNum-1) * setCount;
		}

		const withinLearningSet = (index) => {
			const kanjiNum = index+1;
			return kanjiNum <= set * setCount && kanjiNum > (set-1) * setCount;
		}

		const withinSets = (s1, s2, index) => {
			let isThere = false;
			for (let i = s1; i >= s2;i--) {
				if (withinSet(i, index)) {
					isThere = true;
					break;
				}
			}
			return isThere;
		}

		const withinReviewSet = (index) => {
			const kanjiNum = index+1;
			return (
				!withinLearningSet(index) &&
				(
					( withinSets(set-1, set-2, index) &&  index % 2 === set % 2) || 
					( withinSets(set-3, set-6, index) &&  index % 4 === set % 4) || 
					( withinSets(set-7, set-14, index) &&  index % 8 === set % 8)
				) &&
				kanjiNum <= set * setCount
			);
		}

		let rows = [];
		let reviewIndexes = [];
		let indexes = [];
		for(let i = 0; i < List.length; i++) {

			const isReview = withinReviewSet(i);
			if (!isReview && !withinLearningSet(i)) {
				continue;
			}

			const data = {
				number: i + 1,
				info: List[i],
				isReview: isReview,
			};

			if (!isReview) {
				indexes.push(data);	
			} else {
				reviewIndexes.push(data);
			}
		}
		indexes = indexes.concat(reviewIndexes);
		rows = indexes.map((item, index) => {
			return (
				<div className={(item.isReview ? "row review-row" : "row")} key={index}>
					<div className="kanji">
						{item.info.kanji}
					</div>
					<div className="reading">
						{item.info.reading}
					</div>
					<div className="engrish">
						{item.info.english} 
						<div className="review-label">
							<em>{(item.isReview) ? "(review) " : ""} #{item.number}</em>
							<div>
								<a target="_blank" href={"http://jisho.org/search/" + item.info.kanji + "%23kanji"}>
									jisho
								</a>
								|
								<a target="_blank" href={"http://ejje.weblio.jp/content/" + item.info.kanji }>
									weblio
								</a>
								|
								<a target="_blank" href={"http://kakijun.jp/m-s/u_ms_kensaku.php?KANJI=" + item.info.kanji }>
									kakijun
								</a>
							</div>
							<div>
							{index + 1} of {indexes.length}
							</div>
						</div>
					</div>
				</div>
			);
		});

		return rows;
	}

	render() {
		return (
			<div className="rows">
				{this.renderRows()}
			</div>
		);
	}
}