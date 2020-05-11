

const NO_CHANGES_HEADER = 'No Changes';
const NO_CHANGES_BODY = 'You havent modified this ruleset. Nothing to submit!!!'
const BUTTON_PROPS_NO_CHANGES = {label: 'Generate Ruleset'};
export const NO_CHANGES_MSG = {header: NO_CHANGES_HEADER, body: NO_CHANGES_BODY, type: 'warning-panel'};


const MODIFIED_HEADER = 'Submit Ruleset';
const MODIFIED_BODY = 'You have created / modified this ruleset. Do you want to save these changes into ruleset file?'
export const MODIFIED_MSG = {header: MODIFIED_HEADER, body: MODIFIED_BODY, type: 'submit-panel', buttonProps: BUTTON_PROPS_NO_CHANGES,};


const NO_ATTRIBUTE_HEADER = 'No Facts';
const NO_ATTRIBUTE_BODY = 'There is no facts available in the selected ruleset.'
const BUTTON_PROPS_ATTRIBUTE = {label: 'Create Facts'};
export const NO_ATTRIBUTE_MSG = {header: NO_ATTRIBUTE_HEADER, body: NO_ATTRIBUTE_BODY, buttonProps: BUTTON_PROPS_ATTRIBUTE, type: 'warning-panel'};


const NO_DECISION_HEADER = 'No Decisions';
const NO_DECISION_BODY = 'There is no decisions available in the selected ruleset.'
const BUTTON_PROPS_DECISION = {label: 'Create Decisions'};
export const NO_DECISION_MSG = {header: NO_DECISION_HEADER, body: NO_DECISION_BODY, buttonProps: BUTTON_PROPS_DECISION, type: 'warning-panel'};


const NO_VALIDATION_BODY = 'There is no decisions available in the selected ruleset to validate.'
export const NO_VALIDATION_MSG = {header: NO_DECISION_HEADER, body: NO_VALIDATION_BODY, type: 'warning-panel'};

export const RULE_AVAILABLE_CREATE = { type: 'warning', heading: 'This rule name is already exist' };

export const RULE_AVAILABLE_UPLOAD = { type: 'warning', heading: 'Couldnt upload the filename <name>' };

export const RULE_UPLOAD_ERROR = { type: 'error', heading: 'Problem occured when uploading the files. Try again!!'};

export const RULE_ERROR = { type: 'error', heading: 'Sorry!, some problem occured. Please try again'};