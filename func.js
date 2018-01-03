'use strict'

const Client = require('instagram-private-api').V1;

const insta = async (username,password) => {
  const Device = new Client.Device(username);
  const Storage = new Client.CookieMemoryStorage();
  const session = new Client.Session(Device, Storage);
  try {
    await Client.Session.create(Device, Storage, username, password)
    var account = await session.getAccount();
    account = account.params;
    this.session = session;
    this.account = account;
    this.myId = account.id;
    return Promise.resolve({session,account});
  } catch (err) {
    return Promise.reject(err);
  }
}

insta.setTargetId = (id) => {
  this.tagetId = id || this.myId;
}

insta.getFollowers = async () => {
  const feed = new Client.Feed.AccountFollowers(this.session, this.tagetId);
  try{
    feed.map = item => item.params;
    return Promise.resolve(feed.all());
  }catch (e){
    return Promise.reject(err);
  }
}

insta.getFollowing = async () => {
  const feed = new Client.Feed.AccountFollowing(this.session, this.tagetId);
  try{
    feed.map = item => item.params;
    return Promise.resolve(feed.all());
  }catch (e){
    return Promise.reject(err);
  }
}

insta.doFollow = async () => {
  try {
    await Client.Relationship.create(this.session, this.tagetId);
    return true;
  } catch (e) {
    return false;
  }
}

insta.doUnfollow = async () => {
  try {
    await Client.Relationship.destroy(this.session, this.tagetId);
    return true;
  } catch (e){
    return e;
  }
}

insta.doComment = async (text) => {
  try {
    await Client.Comment.create(this.session, this.tagetId, text);
    return true;
  } catch(e){
    return false;
  }
}

insta.doLike = async () => {
  try{
    await Client.Like.create(this.session, this.tagetId);
    return true;
  } catch(e) {
    return false;
  }
}

module.exports = insta;