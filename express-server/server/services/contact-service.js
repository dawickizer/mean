// Import dependencies (node_modules)
const mongoose = require('mongoose');
const _ = require('lodash');

// Import dependencies (module.exports)
const db = require('../config/db');
const Contact = require('../models/contact').Contact;

// Connect to mongodb
mongoose.connect(db);

// This class is responsible for handling the database operations for Contacts and
// its nested fields. Basic CRUD operations are supported as well as the CRUD
// operations for embedded and referenced fields (nested objects and arrays supported)
class ContactService {

  // Returns all the contacts
  async getAll() {
    return await Contact.find({});
  }

  // Post one to many contacts. If an object is passed in it will be converted to
  // an array of size one. Returns an array of contacts
  async post(contacts) {
    return (!Array.isArray(contacts)) ? (await Contact.insertMany(await this.postNestedData([contacts])))[0]
                                      : await Contact.insertMany(await this.postNestedData(contacts));
  }

  // Helper function for posted nested reference objects/arrays
  async postNestedData(contacts) {
    let nest = async (contacts, path, service) => { for (let i = 0; i < contacts.length; i++) _.set(contacts[i], path, (_.get(contacts[i], path) ? await service.post(_.get(contacts[i], path)) : undefined)); }
    return contacts;
  }

  // Get a specific contact
  async get(id) {
    return await Contact.findById(id);
  }

  // Update a contact
  async put(id, contact) {
    return await Contact.findByIdAndUpdate(id, contact, {new: true}, (err, updatedContact) => {
        if (err) return err;
        else return updatedContact;
    });
  }

  // Delete one to many contacts
  async delete(ids) {
    await this.deleteNestedData(await Contact.find({_id: {$in: (!Array.isArray(ids)) ? [ids] : ids}}));
    return await Contact.deleteMany({_id: {$in: (!Array.isArray(ids)) ? [ids] : ids}});
  }

  // Helper function for posted nested reference objects/arrays
  async deleteNestedData(contacts) {
    let unnest = async (contacts, path, service) => { for (let i = 0; i < contacts.length; i++) await service.delete(_.get(contacts[i], path)); }
    return contacts;
  }
}

module.exports = ContactService;