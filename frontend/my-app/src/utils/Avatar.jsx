function Avatar(author) {
  if (!author) {
    return "https://ui-avatars.com/api/?name=User&background=ccc&color=555";
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    author
  )}&background=random`;
}

export default Avatar;
