document.getElementById("SaveButton").addEventListener("click", async () => {
  const name = document.getElementById("nameInput").value;
  const address = document.getElementById("adress").value;
  const region = document.getElementById("RegionInput").value;
  const city = document.getElementById("CityInput").value;
  const contact = document.getElementById("ContactInput").value;

  const data = { name, address, region, city, contact };

  try {
    const response = await fetch("http://localhost:5000/save-address", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert("Address saved successfully");
    } else {
      alert("Error saving address");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error saving address");
  }
});
