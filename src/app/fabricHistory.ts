
import FabricCommand  from './fabricCommand'

class FabricHistory {
  public index
  public commands: FabricCommand[]
  constructor() {
    this.commands = [];
    this.index = 0;
  }
  getIndex() {
    return this.index;
  }
  back() {
    if (this.index > 0) {
      const command = this.commands[--this.index];
      command.undo();
    }
    return this;
  }
  forward() {
    if (this.index < this.commands.length) {
      const command = this.commands[this.index++];
      command.execute();
    }
    return this;
  }
  add(command: FabricCommand) {
    if (this.commands.length) {
      this.commands.splice(this.index, this.commands.length - this.index);
    }
    this.commands.push(command);
    this.index++;
    return this;
  }
  clear() {
    this.commands.length = 0;
    this.index = 0;
    return this;
  }
}

export default FabricHistory;
