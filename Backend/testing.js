async function test_apis() {
    const url = "https://goymarey-project.onrender.com/graphql";
    const query = `
        query {
          users{
            id
            name
            email
            imageUrl
          }
        }
    `;
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
    });
    const rez = await response.json()
    if (rez.errors) {
      console.error(rez.errors);
    }
    else {
      console.log(`The rez is: `, rez.data.users);
    }
}
test_apis();