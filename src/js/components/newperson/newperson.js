import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import DateInput from '../date-input';
import { updatePerson, updateEvent } from '../../actions/peopleActions';
import { updateParentalRel } from '../../actions/parentalRelsActions';
import { closeNewPersonModal } from '../../actions/modalActions';
// import { resetModalEvent } from '../../actions/modalActions';

/* the following is the code that needs to be inserted into the parent component render method where you will call this modal to open.
You can look in the peoplesearch component for an example of a component that calls this component

  <Modal
        isOpen={modalIsOpen}
        contentLabel="Modal"
        style={modalStyle}
      >
        <NewPerson/>
      </Modal>

*/

@connect(
  (store, ownProps) => {
    console.log('in newperson @connect: ', store);
    return {
      ...ownProps,
      peopleArray:
          store.people.people.map(function(person) {
            var newObj = {};
            var label = person.fName + ' ' + person.lName;
            var value = person._id;
            newObj["value"] = value;
            newObj["label"] = label;
            return newObj;
          }),
      eventTypes:
        store.eventTypes.eventTypes,
      parentalRelTypes:
          store.parentalRelTypes.parentalRelTypes,
      parentalRelSubTypes:
          store.parentalRelSubTypes.parentalRelSubTypes,
    };
  },
  (dispatch) => {
    return {
      closeNewPersonModal: () => {
        dispatch(closeNewPersonModal());
      },
      // deleteNewPerson: (_id) => {
      //   dispatch(deleteNewPerson());
      // },
      saveNewPerson: () => {
        dispatch(saveNewPerson());
      },
      onBlur: (_id, field, value) => {
				dispatch(updatePerson(_id, field, value));
			},
    }
  }
)

export default class NewPerson extends React.Component {
  constructor(props) {
  	super(props);
  	console.log("in new Person State", this.props);

  	this.state = {
      // set all initial values for the new person modal.
      personFName: '',
      personMName: '',
      personLName: '',
      personSexAtBirth: '',
  		eventDateNew: "",
  		eventDateUserNew: "",
      // We are suggesting to the end user that they enter a birth date
  		eventTypeNew: 'Birth',
  		eventPlaceNew: "",
      parent_idNew1: "",
      // We suggest they enter a biological mother
      relationshipTypeNew1: 'Mother',
      subTypeNew1: 'Biological',
			parentStartDateNew1: "",
			parentStartDateUserNew1: "",
			parentEndDateNew1: "",
			parentEndDateUserNew1: "",
      parent_idNew2: "",
      // We suggest they enter a biological father
      relationshipTypeNew2: 'Father',
      subTypeNew2: 'Biological',
      parentStartDateNew2: "",
      parentStartDateUserNew2: "",
      parentEndDateNew2: "",
      parentEndDateUserNew2: "",
  	};
  }

  tempEventDate = (parsedDate, userDate) => {
    this.setState({
      eventDateUserNew: userDate,
      eventDateNew: parsedDate
    });
  }
  tempEventType = (evt) => {
    this.setState({eventTypeNew: evt.value});
    // console.log(this.state, "inside eventType");
  }
  tempEventPlace = (evt) => {
    this.setState({eventPlaceNew: evt.target.value});
  }
  tempSubTypeChange1 = (evt) => {
		this.setState({subTypeNew1: evt.value});
    // console.log(this.state, "inside tempsubtypechange1");

	}
 	tempParentChange1 = (evt) => {
		this.setState({parent_idNew1: evt.value});
    // console.log(this.state, "inside tempParentchange1");
	}
	tempRelTypeChange1 = (evt) => {
		this.setState({relationshipTypeNew1: evt.value});
    // console.log(this.state, "inside tempReltypechange1");
	}
  tempParentStartDate1 = (parsedDate, userDate) => {
    this.setState({
      parentStartDateUserNew1: userDate,
      parentStartDateNew1: parsedDate
    });
  }
  tempParentEndDate1 = (parsedDate, userDate) => {
    this.setState({
      parentEndDateUserNew1: userDate,
      parentEndDateNew1: parsedDate
    });
  }

  tempSubTypeChange2 = (evt) => {
		this.setState({subTypeNew2: evt.value})
	}
 	tempParentChange2 = (evt) => {
		this.setState({parent_idNew2: evt.value});
	}
	tempRelTypeChange2 = (evt) => {
		this.setState({relationshipTypeNew2: evt.value});
	}
  tempParentStartDate2 = (parsedDate, userDate) => {
		this.setState({
			startDateUserNew2: userDate,
			startDateNew2: parsedDate
		});
	}
	tempParentEndDate2 = (parsedDate, userDate) => {
		this.setState({
			endDateUserNew2: userDate,
			endDateNew2: parsedDate
		});
	}
  tempFName = (evt) => {
    // console.log('in tempChange: ', evt.target.value);
    this.setState({personFName: evt.target.value});
  }
  tempMName = (evt) => {
    // console.log("inside eventPlace ", evt.target.value);
    this.setState({personMName: evt.target.value});
  }
  tempLName = (evt) => {
    // console.log("inside eventPlace ", evt.target.value);
    this.setState({personLName: evt.target.value});
  }
  tempSexAtBirth = (evt) => {
    // console.log("inside eventPlace ", evt.target.value);
    this.setState({personSexAtBirth: evt.target.value});
  }

  closeModal = () => {
    this.props.closeNewPersonModal();
  }
  cancelButton = () => {
    this.props.closeNewPersonModal();
  }

  // deleteNewPerson = () => {
  //   console.log("inside delete new person")
  //   this.props.deleteNewPerson(this.props.newPerson.id, evt.value);

  //   if (this.props.closeNewPersonModal) {
  //     this.props.closeModal();
  //   }
  // }
  savePerson = () => {
    console.log("State: ", this.state);
    // first, check to make sure all the data that is needed is valid
    if (!this.state.personFName) {
      alert('Must enter a valid first name');
      return;
    }
    if (!this.state.eventDateNew) {
      alert('Must enter a valid birth date');
      return;
    }
    if (this.state.eventTypeNew !== 'Birth') {
      alert("Must enter a birth date, please make sure the event type is set to Birth");
      return;
    }

    console.log('if get here, then save the record');

    // this.props.saveNewPerson(this.props.newPerson.id, evt.value);
  //   if (this.state.eventDateUserNew !== this.props.event.eventDateUser){
		// 	this.props.updateEvent(this.props.event._id, "eventDate", this.state.eventDateNew);
		// }
		// if (this.state.eventTypeNew !== this.props.event.eventType) {
		// 	this.props.updateEvent(this.props.event._id, "eventType", this.state.eventTypeNew)
		// }
		// if (this.state.eventPlace !== this.props.event.eventPlace) {
		// 	this.props.updateEvent(this.props.event._id, "eventPlace", this.state.eventPlaceNew);
		// }
  //   if (this.props.closeNewPersonModal) {
  //     this.props.closeModal();
  //   }
  }

  render = () => {

    // console.log("props and state in the render", this.props.events.eventType, this.props, this.state);


      return(
      <div>
        <div class="modalClose2">
          <i class="fa fa-window-close-o fa-2x" aria-hidden="true" onClick={this.closeModal}></i>
        </div>
        <div class="modalH">
            New Person
        </div>
        <div class="buffer-modal">
        </div>
        {/*<CompactPeopleDetails person={this.props.person} key={this.props.person._id}/>*/}
          <div class="compactPerson">
    				<div class="personDetails">
    					<div class="pDetail">
    						<input
    							class="form-control"
    							type="text"
    							placeholder="Enter First Name"
                  value={this.state.personFName}
    							onChange={this.tempFName}
    						/>
    						<input
    							class="form-control detail-input"
    							type="text"
    							placeholder="Enter Middle Name"
                  value={this.state.personMName}
                  onChange={this.tempMName}
    						/>
    				</div>
    				<div class="pDetail">
    					<input
    						class="form-control detail-input"
    						type="text"
    						placeholder="Enter Last Name"
    						value={this.state.personLName}
                onChange={this.tempLName}
    					/>
    					<input
    						class="form-control detail-input"
    						type="text"
    						placeholder="Enter Gender At Birth"
    						value={this.state.personSexAtBirth}
                onChange={this.tempSexAtBirth}
    					/>
    				</div>
    			</div>
    			<div class="buffer-modal">
    			</div>
    		</div>
        <div class="event-main">
          <div class="event-row">
            <div class="PR-div">
              <div class="PR-title">
                Date
              </div>
              <div class="PR-drop-1">
                <DateInput
                  onNewDate={this.tempEventDate}
                  initialValue={this.state.eventDateUserNew}
                  field="eventDate"
                />
              </div>
            </div>
          </div>
          <div class="event-row">
            <div class="PR-div">
              <div class="PR-title">
                Type
              </div>
              <div class="PR-drop-1">
                <Select
                  options={this.props.eventTypes}
                  onChange={this.tempEventType}
                  value={this.state.eventTypeNew}
                />
              </div>
            </div>
            <div class="PR-div">
              <div class="PR-title">
                Place
              </div>
              <div class="PR-drop-1">
                <input
                    class="form-control"
                    type="text"
                    value={this.state.eventPlaceNew}
                    onChange={this.tempEventPlace}
                />
              </div>
            </div>
          </div>
        </div>
        <div class="bufferModal2">
				</div>
        <div>
          <div class="PR-main">
					<div class="PR-row-1">
						<div class="PR-div">
							<div class="PR-title">
								Parent Name
							</div>
							<div class="PR-drop-name">
								<Select
									options={this.props.peopleArray}
									onChange={this.tempParentChange1}
									value={this.state.parent_idNew1}
								/>
							</div>
						</div>
					</div>
					<div class="PR-row-2">
						<div class="PR-sub-div">
							<div class="PR-div">
								<div class="PR-title">
									Relationship
								</div>
								<div class="PR-drops">
									<div class="PR-drop-2">
										<Select
											options={this.props.parentalRelTypes}
											onChange={this.tempRelTypeChange1}
											value={this.state.relationshipTypeNew1}
										/>
									</div>
								</div>
							</div>
							<div class="PR-div">
								<div class="PR-title">
									Sub Type
								</div>
								<div class="PR-drops">
									<div class="PR-drop-2">
										<Select
											options={this.props.parentalRelSubTypes}
											onChange={this.tempSubTypeChange1}
											value={this.state.subTypeNew1}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="PR-row-3">
						<div class="PR-date-div">
							<div class="PR-title">
							Start Date
							</div>
							<div class="PR-sDate">
								<DateInput
									initialValue={this.state.parentStartDateUserNew1}
									onNewDate={this.tempParentStartDate1}
									field="startDate"
								/>
							</div>
						</div>
						<div class="PR-date-div">
							<div class="PR-title">
							End Date
							</div>
							<div class="PR-eDate">
								<DateInput
									initialValue={this.state.parentEndDateUserNew1}
									onNewDate={this.tempParentEndDate1}
									field="endDate"
								/>
							</div>
						</div>
					</div>
					<div class="buffer-modal">
					</div>
				</div>
        <div class="PR-main">
					<div class="PR-row-1">
						<div class="PR-div">
							<div class="PR-title">
								Parent Name
							</div>
							<div class="PR-drop-name">
								<Select
									options={this.props.peopleArray}
									onChange={this.tempParentChange2}
									value={this.state.parent_idNew2}
								/>
							</div>
						</div>
					</div>
					<div class="PR-row-2">
						<div class="PR-sub-div">
							<div class="PR-div">
								<div class="PR-title">
									Relationship
								</div>
								<div class="PR-drops">
									<div class="PR-drop-2">
										<Select
											options={this.props.parentalRelTypes}
											onChange={this.tempRelTypeChange2}
											value={this.state.relationshipTypeNew2}
										/>
									</div>
								</div>
							</div>
							<div class="PR-div">
								<div class="PR-title">
									Sub Type
								</div>
								<div class="PR-drops">
									<div class="PR-drop-2">
										<Select
											options={this.props.parentalRelSubTypes}
											onChange={this.tempSubTypeChange2}
											value={this.state.subTypeNew2}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="PR-row-3">
						<div class="PR-date-div">
							<div class="PR-title">
							Start Date
							</div>
							<div class="PR-sDate">
								<DateInput
									initialValue={this.state.parentStartDateUserNew2}
									onNewDate={this.tempParentStartDate2}
									field="startDate"
								/>
							</div>
						</div>
						<div class="PR-date-div">
							<div class="PR-title">
							End Date
							</div>
							<div class="PR-eDate">
								<DateInput
									initialValue={this.state.parentEndDateUserNew2}
									onNewDate={this.tempParentEndDate2}
									field="endDate"
								/>
							</div>
						</div>
					</div>
					<div class="buffer-modal">
					</div>
				</div>
        </div>
        <div class="event-delete-modal">
					<button
						type="button"
						class="btn btn-default modal-delete"
						onClick={this.savePerson}
					>
						Save
					</button>
					<button
						type="button"
						class="btn btn-default modal-delete"
						onClick={this.cancelButton}
					>
						Cancel
					</button>
				</div>
      </div>);
  }
}
