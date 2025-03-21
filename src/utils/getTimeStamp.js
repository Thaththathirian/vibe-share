const getTimeStamp = (createdAt, currentTime) => {
  const postDate = new Date(createdAt);
  const timeDifference = currentTime - postDate;

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return "Just now";
  } else if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  } else if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  } else if (days < 7) {
    return `${days} day${days === 1 ? "" : "s"} ago`;
  } else {
    const isCurrentYear = currentTime.getFullYear() === postDate.getFullYear();
    return postDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: isCurrentYear ? undefined : "numeric",
    });
  }
};

export default getTimeStamp;