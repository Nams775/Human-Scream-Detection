import * as tf from '@tensorflow/tfjs';

export class ScreamDetectionModel {
  private model: tf.LayersModel | null = null;
  private isLoaded = false;

  async loadModel(): Promise<void> {
    try {
      // Try to load a pre-trained model if available
      // For now, we'll create a simple baseline model
      this.model = await this.createBaselineModel();
      this.isLoaded = true;
      console.log('Model loaded successfully');
    } catch (error) {
      console.error('Failed to load model:', error);
      throw error;
    }
  }

  private async createBaselineModel(): Promise<tf.LayersModel> {
    // Create a simple sequential model for scream detection
    // Input: 13 MFCC coefficients
    // Output: Binary classification (scream/no-scream)
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [13], units: 64, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.3 }),
        tf.layers.dense({ units: 32, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.3 }),
        tf.layers.dense({ units: 16, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'sigmoid' }),
      ],
    });

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy'],
    });

    // Initialize with random weights (in production, load pre-trained weights)
    return model;
  }

  async predict(mfccFeatures: number[]): Promise<{ isScream: boolean; confidence: number }> {
    if (!this.model || !this.isLoaded) {
      throw new Error('Model not loaded');
    }

    if (mfccFeatures.length !== 13) {
      throw new Error('Invalid MFCC features length');
    }

    return tf.tidy(() => {
      const input = tf.tensor2d([mfccFeatures], [1, 13]);
      const prediction = this.model!.predict(input) as tf.Tensor;
      const confidence = prediction.dataSync()[0];
      
      return {
        isScream: confidence > 0.5,
        confidence: confidence,
      };
    });
  }

  async trainOnSample(mfccFeatures: number[], isScream: boolean): Promise<void> {
    if (!this.model || !this.isLoaded) {
      throw new Error('Model not loaded');
    }

    const xs = tf.tensor2d([mfccFeatures], [1, 13]);
    const ys = tf.tensor2d([[isScream ? 1 : 0]], [1, 1]);

    await this.model.fit(xs, ys, {
      epochs: 1,
      verbose: 0,
    });

    xs.dispose();
    ys.dispose();
  }

  async saveModel(path: string): Promise<void> {
    if (!this.model) {
      throw new Error('No model to save');
    }
    await this.model.save(path);
  }

  dispose(): void {
    if (this.model) {
      this.model.dispose();
      this.model = null;
      this.isLoaded = false;
    }
  }
}

// Singleton instance
let modelInstance: ScreamDetectionModel | null = null;

export async function getModel(): Promise<ScreamDetectionModel> {
  if (!modelInstance) {
    modelInstance = new ScreamDetectionModel();
    await modelInstance.loadModel();
  }
  return modelInstance;
}
