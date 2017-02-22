import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';

import DateInput from './date-input';
import CompactEvent from './compactModal/compactEvent';
import CompactPeopleDetails from './compactModal/CompactPeopleDetails';
import CompactParentalRel from './compactModal/compactParentalRel';
// import { updatePerson } from '../actions/peopleActions';
// import { updateEvent } from '../actions/eventsActions';
// import { updateParentalRel } from '../actions/parentalRelsActions';
import { closeNewPersonModal, deleteNewPerson, saveNewPerson } from '../actions/modalActions';
import { resetModalEvent } from '../actions/modalActions';




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
    return {
      ...ownProps,
      event:
        store.modal.event,
      eventTypes:
        store.eventTypes.eventTypes,
        star:
          store.people.people.find (function(p) {
            return p._id === store.modal.parentalRel.child_id;
          }),
        parentalRel:
          store.modal.parentalRel,
        // with the parent_id from the parentalRel object, get the details of the person who is the parent
        parentalRelTypes:
          store.parentalRelTypes.parentalRelTypes,
        parentalRelSubTypes:
          store.parentalRelSubTypes.parentalRelSubTypes,
        parent:
          store.people.people.find(function(p) {
            return p._id === store.modal.parentalRel.parent_id;
          }),
        peopleArray:
          store.people.people.map(function(person) {
            var newObj = {};
            var label = person.fName + ' ' + person.lName;
            var value = person._id;
            newObj["value"] = value;
            newObj["label"] = label;
            return newObj;
          }),
        person: store.people.people.find(function(s) {
          return (store.modal.newPerson.id === s._id)
        }),
      events: store.events.events.filter(function(e) { // doing a find returns a single object, instead of an array, which cannot be mapped to the lineItem
        return (e.person_id === store.modal.newPerson.id && e.eventType === 'Birth')
      }),
      parents: store.parentalRels.parentalRels.filter(function(p) {
        return (p.child_id === store.modal.newPerson.id)
      }),
      modalIsOpen: store.modal.newPerson.modalIsOpen,
    };
  },
  (dispatch) => {
    return {
      closeNewPersonModal: () => {
        dispatch(closeNewPersonModal());
      },
      deleteNewPerson: (_id) => {
        dispatch(deleteNewPerson());
      },
      saveNewPerson: () => {
        dispatch(saveNewPerson());
      },
    }
  }
)

export default class NewPerson extends React.Component {
  constructor(props) {
  	super(props);
  	console.log("in new Person State", this.props);

  	// this.state.relType stores the value for the relationshipType dropdown. Per the online forums, this is how you tell react-select what value to display (https://github.com/JedWatson/react-select/issues/796)
  	this.state = {
  		// while in transition to using startDates and startDateUsers (and endDates and endDateUsers), if the User entered field does not yet exist, populate it with the startDate or endDate field. Eventually all records will have the 'User' fields and this code can be changed by removing the condition and just setting the field to the value from this.props.pairBondRel

  		eventDateNew: this.props.event.eventDate ? this.props.event.eventDate: "",

  		eventDateUserNew: this.props.event.eventDate ? this.props.event.eventDate: "",

  		eventTypeNew: this.props.event.eventType ? this.props.event.eventType: "",

  		eventPlaceNew: this.props.event.eventPlace ? this.props.event.eventPlace: "",


      parent_idNew1: this.props.parent ? this.props.parent._id : "",

			relationshipTypeNew1: this.props.parentalRel.relationshipTypeNew ? this.props.relationShipTypeNew.eventDate: "",

			subTypeNew1: this.props.parentalRel.subTypeNew1 ? this.props.parentalRel.subTypeNew1: "",

			parentStartDateNew1: this.props.parentalRel.startDateNew1 ? this.props.parentalRel.startDateNew1: "",

			parentStartDateUserNew1: this.props.parentalRel.startDateUserNew1 ? this.props.parentalRel.startDateUserNew1: "",

			parentEndDateNew1: this.props.parentalRel.endDateNew1 ? this.props.parentalRel.endDateNew1: "",

			parentEndDateUserNew1: this.props.parentalRel.endDateUserNew1 ? this.props.parentalRel.endDateUserNew1: "",

      parent_idNew2: this.props.parent ? this.props.parent._id : "",

      relationshipTypeNew2: this.props.parentalRel.relationshipTypeNew ? this.props.relationShipTypeNew.eventDate: "",

      subTypeNew2: this.props.parentalRel.subTypeNew2 ? this.props.parentalRel.subTypeNew2: "",

      parentStartDateNew2: this.props.parentalRel.startDateNew2 ? this.props.parentalRel.startDateNew2: "",

      parentStartDateUserNew2: this.props.parentalRel.startDateUserNew2 ? this.props.parentalRel.startDateUserNew2: "",

      parentEndDateNew2: this.props.parentalRel.endDateNew2 ? this.props.parentalRel.endDateNew2: "",

      parentEndDateUserNew2: this.props.parentalRel.endDateUserNew2 ? this.props.parentalRel.endDateUserNew2: "",

  	};
  }
  tempEventDate = (parsedDate, userDate) => {
    this.setState({
      eventDateUserNew: userDate,
      eventDateNew: parsedDate
    });
    console.log(this.state, "inside tempEventDate");
  }
  tempEventType = (evt) => {
    this.setState({eventTypeNew: evt.value});
    console.log(this.state, "inside eventType");
  }
  tempEventPlace = (evt) => {
    this.setState({eventPlaceNew: evt.target.value});
    console.log(this.state, "inside eventPlace");
  }

  tempSubTypeChange1 = (evt) => {
		this.setState({subTypeNew1: evt.value});
    console.log(this.state, "inside tempsubtypechange1");

	}
 	tempParentChange1 = (evt) => {
		this.setState({parent_idNew1: evt.value});
    console.log(this.state, "inside tempParentchange1");
	}
	tempRelTypeChange1 = (evt) => {
		this.setState({relationshipTypeNew1: evt.value});
    console.log(this.state, "inside tempReltypechange1");
	}
  tempParentStartDate1 = (parsedDate, userDate) => {
    this.setState({
      parentStartDateUserNew1: userDate,
      parentStartDateNew1: parsedDate
    });
    console.log(this.state, "inside tempstartdate1");
  }
  tempParentEndDate1 = (parsedDate, userDate) => {
    this.setState({
      parentEndDateUserNew1: userDate,
      parentEndDateNew1: parsedDate
    });
    console.log(this.state, "inside tempEndDatetypeChange1");
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

  closeModal = () => {
    // This is validation for the contents of the modal. The user must either delete the person or enter the required information.
    if (!this.props.events[0].eventDate) { // the first record should be the newly created Birth record, might need some validation here.
      msg.show('Need to enter a valid birth date', {
        type: 'error'
      });
    } else if (!this.props.person.fName) {
      msg.show('Need to enter a valid first name', {
        type: 'error'
      })
    } else {
      this.props.closeNewPersonModal();
    }
  }

  deleteNewPerson = () => {
    console.log("inside delete new person")
    this.props.deleteNewPerson(this.props.newPerson.id, evt.value);

    if (this.props.closeNewPersonModal) {
      this.props.closeModal();
    }
  }
  savePerson = () => {
    // this.props.saveNewPerson(this.props.newPerson.id, evt.value);
    if (this.state.eventDateUserNew !== this.props.event.eventDateUser){
			this.props.updateEvent(this.props.event._id, "eventDate", this.state.eventDateNew);
		}
		if (this.state.eventTypeNew !== this.props.event.eventType) {
			this.props.updateEvent(this.props.event._id, "eventType", this.state.eventTypeNew)
		}
		if (this.state.eventPlace !== this.props.event.eventPlace) {
			this.props.updateEvent(this.props.event._id, "eventPlace", this.state.eventPlaceNew);
		}
    if (this.props.closeNewPersonModal) {
      this.props.closeModal();
    }
  }

  render = () => {

    const { person, events, parents, modalIsOpen } = this.props;

    // events must be mapped to the lineItem, and cannot be passed in individually, not sure why this happens, leaving it for now
    const mappedEvents = events.map(event =>
      <CompactEvent event={event} key={event._id}/>
    )

    const mappedParents = parents.map(parentalRel =>
    <CompactParentalRel parentalRel={parentalRel} key={parentalRel._id}/>
    );

    const { event, eventTypes, parentalRel, parent, peopleArray, parentalRelTypes, parentalRelSubTypes  } = this.props;
    const { eventDateUser, eventType } = this.state;
    /*{mappedEvents}*/


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
        <CompactPeopleDetails person={person} key={person._id}/>
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
                  options={eventTypes}
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
									options={peopleArray}
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
											options={parentalRelTypes}
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
											options={parentalRelSubTypes}
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
									options={peopleArray}
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
											options={parentalRelTypes}
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
											options={parentalRelSubTypes}
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
						onClick={this.deleteNewPerson}
					>
						Cancel
					</button>
				</div>
      </div>);
  }
}
