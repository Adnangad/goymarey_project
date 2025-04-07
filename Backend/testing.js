async function test_apis() {
    const url = "http://localhost:4000/graphql";
    const query = `
        mutation {
        deleteUser(email: "obuya@gmail.com", password: "somepassword") {
          success
          message
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
      console.log(`The rez is: `, rez.data);
    }
}
test_apis();