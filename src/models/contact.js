export default class Contact{
   constructor(data) {
        this.contactName = data.contactName || data.alias;
        this.mcptt_id = data.mcptt_id;
        this.tetra_id = data.tetra_id; //Radio id
   }
}
