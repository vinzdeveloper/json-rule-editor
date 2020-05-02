import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { login } from '../../actions/app';
import { uploadRuleset } from '../../actions/ruleset';
import { TitlePanel } from '../../components/panel/panel';
import Button from '../../components/button/button';
import { createHashHistory } from 'history';


function readFile(file, cb) {
  // eslint-disable-next-line no-undef
  var reader = new FileReader();
  reader.onload = () => {
    cb(JSON.parse(reader.result), file.name)
  }

  return reader.readAsText(file);
}

class HomeContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {uploadedFilesCount: 0, files: [], ruleset: []};
        this.drop = this.drop.bind(this);
        this.allowDrop = this.allowDrop.bind(this);
        this.printFile = this.printFile.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
        this.chooseFile = this.chooseFile.bind(this);
        this.chooseDirectory = this.chooseDirectory.bind(this);
    }

    allowDrop(e) {
      e.preventDefault();
    }

    printFile(file, name) {
      const isFileAdded = this.state.files.some(fname => fname === name);
      if (!isFileAdded) {
        const files = this.state.files.concat([name]);
        const ruleset = this.state.ruleset.concat(file);
        this.setState({files, ruleset});
      }
    }

    uploadFile(items, index) {
      const file = items[index].getAsFile();
      readFile(file, this.printFile);
    }

    uploadDirectory(item) {
      var dirReader = item.createReader();
      const print = this.printFile;
      dirReader.readEntries(function(entries) {
        for (let j=0; j<entries.length; j++) {
          let subItem = entries[j];
          if (subItem.isFile) {
            subItem.file((file) => {
              readFile(file, print);
            });
          }
        }
      });
   }

   chooseFile() {
    const file = document.getElementById("uploadFile");
    if (file && file.files) {
      for (let i = 0; i < file.files.length; i++) {
        readFile(file.files[i], this.printFile);
      }
    }
   }

   chooseDirectory(e) {
    const files = e.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        if (files[i].type === 'application/json') {
          readFile(files[i], this.printFile);
        }
      }
    }
   }

    drop(e) {
      e.preventDefault();
      const items = e.dataTransfer.items;
      if (items) {
        for (let i = 0; i < items.length; i++) {
          let item = items[i].webkitGetAsEntry();
          if (item.isFile) {
            this.uploadFile(items, i);
          } else if (item.isDirectory) {
              this.uploadDirectory(item);
            }
          }
        }
    }
    
    handleUpload() {
      if(this.state.ruleset.length > 0) {
        this.props.uploadRuleset(this.state.ruleset);
        this.navigate('./ruleset');
      }
    }

    navigate(location)  {
      const history = createHashHistory();
      this.props.login();
      history.push(location); 
    }

    render() {
      return <div>
        <div className="single-panel-container">
          <TitlePanel title="Upload Rulesets" titleClass="fa fa-cloud-upload">
            <div className="upload-panel">
              <div className="drop-section" onDrop={this.drop} onDragOver={this.allowDrop}>
                  <div><label htmlFor="uploadFile">Choose Ruleset directory<input id="uploadFile" type="file" onChange={this.chooseDirectory} webkitdirectory="true" multiple/></label> or Drag Files</div>
                  {this.state.files.length > 0 && <div className="file-drop-msg">{`${this.state.files.length} json files are dropped!`}</div>}
              </div>
            </div>
            <div className="btn-group">
              <Button label={"Upload"} onConfirm={this.handleUpload} classname="primary-btn" type="button" />
              {!this.props.loggedIn && <Button label={"Create"} onConfirm={() => this.navigate('./create-ruleset')} classname="primary-btn" type="button" disabled={this.state.files.length > 0} />}
              </div>
          </TitlePanel>
        </div>
      </div>
    }
}

HomeContainer.propTypes = {
  ruleset: PropTypes.array,
  uploadRuleset: PropTypes.func,
  login: PropTypes.func,
  loggedIn: PropTypes.bool,
}

HomeContainer.defaultProps = {
  ruleset: [],
  uploadRuleset: () => false,
  login: () => false,
  loggedIn: false,
}

const mapStateToProps = (state) => ({
  loggedIn: state.app.loggedIn,
});

const mapDispatchToProps = (dispatch) => ({

  login: () => dispatch(login()),
  uploadRuleset: (ruleset) =>  dispatch(uploadRuleset(ruleset)),

});

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);