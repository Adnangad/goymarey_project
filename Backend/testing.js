async function test_apis() {
    const url = "http://localhost:4000/graphql";
    const query = `
        query {
          user(id: "7") {
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
      console.log(`The rez is: `, rez.data.user);
    }
}
test_apis();