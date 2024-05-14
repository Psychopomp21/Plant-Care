document.addEventListener('DOMContentLoaded', function () {
    const reminderTimeInput = document.getElementById('reminder-time');
    const defaultReminderCheckbox = document.getElementById('default-reminder');
    const setReminderButton = document.getElementById('set-reminder');
  
    setReminderButton.addEventListener('click', function () {
      const reminderTime = reminderTimeInput.value;
      const isDefault = defaultReminderCheckbox.checked;
  
      // Save reminder time and default status in local storage
      localStorage.setItem('reminderTime', reminderTime);
      localStorage.setItem('isDefault', isDefault);
  
      // Set up the reminder
      setReminder(reminderTime);
    });
  
    // Load default reminder if it exists
    const savedReminderTime = localStorage.getItem('reminderTime');
    const savedIsDefault = localStorage.getItem('isDefault');
  
    if (savedReminderTime && savedIsDefault === 'true') {
      setReminder(savedReminderTime);
      reminderTimeInput.value = savedReminderTime;
      defaultReminderCheckbox.checked = true;
    }
  });
  
  function setReminder(time) {
    // Convert time to milliseconds
    const [hours, minutes] = time.split(':');
    const reminderTime = new Date();
    reminderTime.setHours(hours, minutes, 0);
  
    // Calculate time until next reminder
    const now = new Date();
    let timeUntilReminder = reminderTime - now;
    if (timeUntilReminder < 0) {
      timeUntilReminder += 24 * 60 * 60 * 1000; // Add a day if reminder time already passed
    }
  
    // Set timeout for reminder
    setTimeout(function () {
      alert('Time to water your plants!');
      // Repeat the reminder daily
      setReminder(time);
    }, timeUntilReminder);
  }
  let plants = JSON.parse(localStorage.getItem('plants')) || [];

  document.addEventListener('DOMContentLoaded', () => {
    displayPlants();
  });
  
  function addPlant() {
    const plantName = document.getElementById('plantName').value;
    const plantImage = document.getElementById('plantImage').files[0];
  
    if (plantName && plantImage) {
      const reader = new FileReader();
      reader.onload = function(event) {
        const plant = {
          name: plantName,
          images: [event.target.result]
        };
        plants.push(plant);
        localStorage.setItem('plants', JSON.stringify(plants));
        displayPlants();
      };
      reader.readAsDataURL(plantImage);
    } else {
      alert('Please provide both plant name and image.');
    }
  }
  
  function displayPlants() {
    const plantList = document.getElementById('plantList');
    plantList.innerHTML = '';
    plants.forEach((plant, index) => {
      const listItem = document.createElement('li');
      listItem.textContent = plant.name;
      listItem.onclick = () => openModal(index);
      plantList.appendChild(listItem);
    });
  }
  
  function openModal(index) {
    const modal = document.getElementById('modal');
    const modalPlantName = document.getElementById('modalPlantName');
    const modalPlantImages = document.getElementById('modalPlantImages');
  
    modalPlantName.textContent = plants[index].name;
    modalPlantImages.innerHTML = '';
  
    plants[index].images.forEach(image => {
      const img = document.createElement('img');
      img.src = image;
      img.style.width = '100px';
      img.style.margin = '10px';
      modalPlantImages.appendChild(img);
    });
  
    modal.style.display = 'block';
    modal.dataset.index = index;
  }
  
  function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
  }
  
  function addImageToPlant() {
    const modal = document.getElementById('modal');
    const index = modal.dataset.index;
    const newImage = document.getElementById('modalPlantImage').files[0];
  
    if (newImage) {
      const reader = new FileReader();
      reader.onload = function(event) {
        plants[index].images.push(event.target.result);
        localStorage.setItem('plants', JSON.stringify(plants));
        openModal(index);
      };
      reader.readAsDataURL(newImage);
    } else {
      alert('Please select an image to add.');
    }
  }  