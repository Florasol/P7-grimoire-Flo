export function average(array) { 
    if (array.length === 0) return 0; // Empêche la division par 0 si le tableau est vide
    const sum = array.reduce((acc, nb) => acc + nb, 0);
    return (sum / array.length);
  }
