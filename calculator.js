function calculateAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  let months = monthDiff;
  if (months < 0) {
    months += 12;
  }

  return age + months / 12;
}

function calculateRER(weight) {
  return 70 * Math.pow(parseFloat(weight), 0.75);
}

function calculateMER(weight, birthDate, neutered) {
  const age = calculateAge(birthDate);
  const isNeutered = neutered === 'yes';
  const rer = calculateRER(weight);
  let mer;
  if (age < 1 / 3) {
    mer = rer * 2.5;
  } else if (age < 1) {
    mer = rer * 2.0;
  } else if (isNeutered) {
    mer = rer * 1.2;
  } else {
    mer = rer * 1.4;
  }
  return Math.round(mer);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    calculateAge,
    calculateRER,
    calculateMER,
  };
} else {
  window.calculateAge = calculateAge;
  window.calculateRER = calculateRER;
  window.calculateMER = calculateMER;
}
