fetch("/Data/data.json")
  .then(res => res.json())
  .then(data => {
    if (!localStorage.getItem("hospitalData")) {
      localStorage.setItem("hospitalData", JSON.stringify(data));
    }
  });

  