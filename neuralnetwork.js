// Neural Network
// Yu Jiang Tham

// Neuron

function Neuron(value) {
  this.inputs = [];
  this.weights = [];
  if (value) { 
    this.output = value;
  } else {
    this.output = 0;
  }
}

Neuron.prototype.fire = function () {
  var potential = 0;
  for (var i = 0; i < this.inputs.length; ++i) {
    potential += this.inputs[i] * this.weights[i];
  }
  if (potential > 0) {
    this.output = 1;
  }
};


// Neuron Layer

function Layer(numNeurons, parentLayer, bias) {
  this.numNeurons = numNeurons;
  this.neurons = [];

  // Create neurons
  if (typeof bias !== 'undefined') {
    this.neurons.push(new Neuron(bias));
  }
  for (var i = 0; i < numNeurons; ++i) {
    var neuron = new Neuron();
    if (parentLayer) {
      for (var j = 0; j < parentLayer.neurons.length; ++j) {
        neuron.weights.push(2*Math.random()-1);//(j === 0 ? -1 : 1) * Math.random()); 
      } 
    }
    this.neurons.push(neuron);
  }
}

Layer.prototype.enumerate = function () {
  for (var i = 0; i < this.neurons.length; ++i) {
    console.log(this.neurons[i])
  }
};


// Neural Network

function NeuralNetwork(neuronsPerLayerArray, biasTerms) {
  if (neuronsPerLayerArray.length !== biasTerms.length+1) {
    throw new Error("Bias term length must be Neuron Length Layer - 1");
  }
  if (typeof neuronsPerLayerArray != "object" || typeof biasTerms != "object")
  this.neuronsAtLayer = neuronsPerLayerArray;
  this.layers = [];
  this.biasTerms = biasTerms;

  for (var i = 0; i < neuronsPerLayerArray.length; ++i) {
    console.log("---------");
    console.log("layer: " + i);
    var parentLayer = i != 0 ? this.layers[i-1] : null;
    var layer = new Layer(neuronsPerLayerArray[i], parentLayer, biasTerms[i]);
    this.layers.push(layer);
  }
}

NeuralNetwork.prototype.enumerate = function () {
  for (var i = 0; i < this.layers.length; ++i) {
    console.log("=======================================================");
    this.layers[i].enumerate();
  }
};

NeuralNetwork.prototype.input = function (inputArray) {
  if (inputArray.length !== this.layers[0].neurons.length-1) {
    console.log(inputArray.length + " ?= " + this.layers[0].neurons.length);
    throw new Error("Incorrect input array length.  Input array length must match input layer length.");
  }
  for (var i = 1; i < this.layers[0].neurons.length; ++i) {
    this.layers[0].neurons[i].output = inputArray[i-1];
  }
};

NeuralNetwork.prototype.compute = function () {
  for (var i = 1; i < this.layers.length; ++i) {
    console.log('layer: ' + i);
    for (var j = 0; j < this.layers[i].neurons.length; ++j) {
      if (i !== this.layers.length-1 && j === 0) j = 1;
      var activation = CalculateActivationValue(this.layers[i].neurons[j], this.layers[i-1]);
      var out = Step(activation);
      console.log(i + ", " + j + ": " + out);
      this.layers[i].neurons[j].output = out;
    }
  }
}


// Helper functions

function CalculateActivationValue(neuron, previousLayer) {
  var totalValue = 0;
  for (var i = 0; i < previousLayer.neurons.length; i++) {
    neuron.inputs.push(previousLayer.neurons[i].output);
    totalValue += neuron.weights[i] * neuron.inputs[i];
  }
  return totalValue;
}

function Step(input) {
  return input > 0 ? 1 : 0;
}

function Sigmoid(input) {
  console.log(input);
  return 1/(1+Math.exp(input));
}


// Output formatting

function Break(numLines, character) {
  var charString = ""
  for (var i = 0; i < 80; ++i) {
    if (character) {
      charString += character;
    } else {
      charString += " ";
    }
  }
  console.log(" ");
  for (var i = 0; i < numLines; ++i) {
    console.log(charString)
  }
  console.log(" ");
}



// Run the network

var nn = new NeuralNetwork([3,5,5,2], [1,1,1]);
nn.enumerate();

Break(3,'*');

nn.input([1,0,1]);
nn.enumerate();

Break(3,'@');
nn.compute();
nn.enumerate();

