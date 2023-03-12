const avatarStyles: string[] = [
  "adventurer",
  "adventurer-neutral",
  "avataaars",
  "avataaars-neutral",
  "big-ears",
  "big-ears-neutral",
  "big-smile",
  "bottts",
  "bottts-neutral",
  "croodles",
  "croodles-neutral",
  "fun-emoji",
  "icons",
  "identicon",
  "initials",
  "lorelei",
  "lorelei-neutral",
  "micah",
  "miniavs",
  "open-peeps",
  "personas",
  "pixel-art",
  "pixel-art-neutral",
  "shapes",
  "thumbs",
];

const getRandomAvatarStyle = (): string => {
  const index: number = Math.floor(Math.random() * avatarStyles.length);
  return avatarStyles[index];
};

export const generateRandomAvatar = async (email: string): Promise<string> => {
  const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const _email: string = email.replaceAll(" ", "");
  const isValidEmail: boolean = emailRegex.test(_email);

  if (!isValidEmail) {
    throw new Error("Invalid email");
  }

  const entropySource = (): string =>
    Math.random().toString(36).substring(2, 7);
  const replaceAt: string = `-${entropySource()}-`;
  const replaceDot: string = `-${entropySource()}-`;
  const seed: string = _email
    .replace("@", replaceAt)
    .replaceAll(".", replaceDot);

  const randomAvatarStyle: string = getRandomAvatarStyle();

  if (!randomAvatarStyle || !avatarStyles.includes(randomAvatarStyle)) {
    console.error("Invalid avatar style");
    throw new Error("Something failed");
  }

  const avatarUrl: string = `https://api.dicebear.com/5.x/${randomAvatarStyle}/svg?seed=${seed}&size=200&radius=50`;
  return avatarUrl;
};
