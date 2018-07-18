import React, { Fragment } from 'react';
import Autosuggest from 'react-autosuggest';
import { Label, FormGroup, Input, Col, Row, Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import config from '../config';

import handleErrors from '../lib/handleErrors';

export default class ChooseConcept extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      suggestions: [],
      modal: false,
      autoSuggestValue: props.concept.name
    };
  }

  onAutoSuggestChange = (event, { newValue, method }) => {
    this.setState({ autoSuggestValue: newValue });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    fetch(`/search/concept?name=${value}`, { headers: { "ORGANISATION-NAME": config.orgName } })
      .then(handleErrors)
      .then(response => response.json())
      .then(concepts => this.setState({ suggestions: concepts }))
      .catch(err => {
        console.log(err);
      });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  onSuggestionSelected = (event, { suggestion }) => {
    this.setState({
      autoSuggestValue: '',
      modal: false
    });

    this.props.onConceptSelected(suggestion);
  };

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  }

  render() {
    const inputProps = {
      value: this.state.autoSuggestValue,
      onChange: this.onAutoSuggestChange
    };

    // return (
    //   <Autosuggest
    //     id={this.props.id}
    //     suggestions={this.state.suggestions}
    //     onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
    //     onSuggestionsClearRequested={this.onSuggestionsClearRequested}
    //     onSuggestionSelected={this.onSuggestionSelected}
    //     getSuggestionValue={(concept) => concept.name}
    //     renderSuggestion={(concept) => <span>{concept.name}</span>}
    //     inputProps={inputProps} />
    // );
    return (
      <Fragment>
        <FormGroup>
          <Label for="conceptName">Concept name</Label>
          <Row>
            <Col sm>
              <Input readOnly value={this.props.concept.name} id="conceptName" type="text"></Input>
            </Col>
            <Col>
              <div>
                {/*TODO: Remove href from the following anchor tag. Having the href scrolls the page to top regardless of where in page you are. 
                  Style it so it looks like a link and has a hand cursor instead of text.
                  Or make it a span and give link like styling using bootstrap(if not possible via bootstrap then by manual css)
                */}
                <a href="#" onClick={this.toggle}><u>Choose a different concept</u></a>
                <Modal centered isOpen={this.state.modal} toggle={this.toggle}>
                  <ModalHeader toggle={this.toggle}>{this.props.modalHeader}</ModalHeader>
                  <ModalBody>
                    <form onSubmit={(e) => e.preventDefault()}>
                      <FormGroup>
                        <Label for="findConcept">Find Concept</Label>
                        <Autosuggest
                          id={this.props.id}
                          suggestions={this.state.suggestions}
                          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                          onSuggestionSelected={this.onSuggestionSelected}
                          getSuggestionValue={(concept) => concept.name}
                          renderSuggestion={(concept) => <span>{concept.name}</span>}
                          inputProps={inputProps} />
                      </FormGroup>
                    </form>
                  </ModalBody>
                </Modal>
              </div>
            </Col>
          </Row>
        </FormGroup>
        <FormGroup>
          <Label for="dataType">Datatype</Label>
          <Input readOnly value={this.props.concept.dataType} id="dataType" type="text"></Input>
        </FormGroup>
      </Fragment>
    );
  }
}