// export const sortByFilter = (category: string) => {
//   if (category !== undefined) {
//     category = category.toLowerCase();

//     if (category === "most upvotes")
//       return (a: { upvotes: number }, b: { upvotes: number }) => {
//         return b.upvotes - a.upvotes;
//       };
//     else if (category === "least upvotes")
//       return (a: { upvotes: number }, b: { upvotes: number }) => {
//         return a.upvotes - b.upvotes;
//       };
//     else if (category === "most comments")
//       return (
//         a: { comments: string | any[] },
//         b: { comments: string | any[] }
//       ) => {
//         return b.comments.length - a.comments.length;
//       };
//     else if (category === "least comments")
//       return (
//         a: { comments: string | any[] },
//         b: { comments: string | any[] }
//       ) => {
//         return a.comments.length - b.comments.length;
//       };
//   }
// };

export const sortByFilter = (category: string) => {
  const categoryMap: { [key: string]: (a: any, b: any) => number } = {
    "most upvotes": (a, b) => b.upvotes - a.upvotes,
    "least upvotes": (a, b) => a.upvotes - b.upvotes,
    "most comments": (a, b) => b.comments.length - a.comments.length,
    "least comments": (a, b) => a.comments.length - b.comments.length,
  };

  const sortFunc = categoryMap[category?.toLowerCase() || ""];

  return sortFunc || ((a, b) => 0);
};


export const sortByDate = (
  a: { created_at: number },
  b: { created_at: number }
) => {
  return b.created_at - a.created_at;
};
