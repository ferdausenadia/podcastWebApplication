class UserDto {
  id;
  phone;
  name;
  profile;
  activated;
  createdAt;

  constructor(user) {
      this.id = user._id;
      this.phone = user.phone;
      this.name = user.name;
      this.profile = user.profile;
      this.activated = user.activated;
      this.createdAt = user.createdAt;
  }
}

module.exports = UserDto;