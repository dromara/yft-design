
import { Object as FabricObject } from "fabric";

class FabricCommand {
  public receiver: FabricObject
  public state: any
  public prevState: any
  public stateProperties: any
  constructor(receiver: FabricObject) {
    this.receiver = receiver;

    this._initStateProperties();
    this.state = {};
    this.prevState = {};

    this._saveState();
    this._savePrevState();
  }
  execute() {
    this._restoreState();
    this.receiver.setCoords();
  }
  undo() {
    this._restorePrevState();
    this.receiver.setCoords();
  }
  _initStateProperties() {
    this.stateProperties = Object.keys(this.receiver._stateProperties);
  }
  _restoreState() {
    this._restore(this.state);
  }
  _restorePrevState() {
    this._restore(this.prevState);
  }
  _restore(state: any) {
    this.stateProperties.forEach(prop => {
      this.receiver.set(prop, state[prop]);
    });
  }
  _saveState() {
    this.stateProperties.forEach(prop => {
      this.state[prop] = this.receiver.get(prop);
    });
  }
  _savePrevState() {
    if (this.receiver._stateProperties) {
      this.stateProperties.forEach(prop => {
        this.prevState[prop] = this.receiver._stateProperties[prop];
      });
    }
  }
}

export default FabricCommand;
