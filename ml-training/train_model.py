import numpy as np
import tensorflow as tf
from tensorflow import keras
from sklearn.metrics import classification_report, confusion_matrix
import tensorflowjs as tfjs
import os

print("=" * 60)
print("SCREAM DETECTION MODEL TRAINING")
print("=" * 60)

# Load preprocessed data
print("\n📂 Loading training data...")
X_train = np.load('X_train.npy')
X_test = np.load('X_test.npy')
y_train = np.load('y_train.npy')
y_test = np.load('y_test.npy')

print(f"✅ Training samples: {len(X_train)}")
print(f"✅ Testing samples: {len(X_test)}")
print(f"✅ Feature dimension: {X_train.shape[1]}")

# Create model (same architecture as in the app)
print("\n🧠 Building neural network model...")
model = keras.Sequential([
    keras.layers.Dense(64, activation='relu', input_shape=(13,), name='dense_1'),
    keras.layers.Dropout(0.3, name='dropout_1'),
    keras.layers.Dense(32, activation='relu', name='dense_2'),
    keras.layers.Dropout(0.3, name='dropout_2'),
    keras.layers.Dense(16, activation='relu', name='dense_3'),
    keras.layers.Dense(1, activation='sigmoid', name='output')
], name='scream_detection_model')

# Compile model
model.compile(
    optimizer=keras.optimizers.Adam(learning_rate=0.001),
    loss='binary_crossentropy',
    metrics=['accuracy']
)

print("\n📋 Model Summary:")
model.summary()

# Train model
print("\n🚀 Training model...")
print("-" * 60)
history = model.fit(
    X_train, y_train,
    validation_split=0.2,
    epochs=50,
    batch_size=32,
    verbose=1,
    callbacks=[
        keras.callbacks.EarlyStopping(
            patience=10,
            restore_best_weights=True,
            verbose=1
        ),
        keras.callbacks.ReduceLROnPlateau(
            factor=0.5,
            patience=5,
            verbose=1
        )
    ]
)

# Evaluate model
print("\n" + "=" * 60)
print("📊 EVALUATING MODEL")
print("=" * 60)
test_loss, test_accuracy = model.evaluate(X_test, y_test, verbose=0)
print(f"\n✅ Test Accuracy: {test_accuracy * 100:.2f}%")
print(f"✅ Test Loss: {test_loss:.4f}")

# Predictions
y_pred = (model.predict(X_test, verbose=0) > 0.5).astype(int).flatten()

print("\n📈 Classification Report:")
print("-" * 60)
print(classification_report(
    y_test,
    y_pred,
    target_names=['Non-Scream', 'Scream'],
    digits=3
))

print("\n📊 Confusion Matrix:")
print("-" * 60)
cm = confusion_matrix(y_test, y_pred)
print(f"                Predicted")
print(f"                Non-Scream  Scream")
print(f"Actual Non-Scream    {cm[0][0]:3d}       {cm[0][1]:3d}")
print(f"Actual Scream        {cm[1][0]:3d}       {cm[1][1]:3d}")

# Save model
print("\n" + "=" * 60)
print("💾 SAVING MODEL")
print("=" * 60)

# Create public/model directory in the parent folder
model_dir = os.path.join('..', 'public', 'model')
os.makedirs(model_dir, exist_ok=True)

# Save in TensorFlow format
print("\n📁 Saving TensorFlow model...")
model.save('scream_detection_model')
print("✅ Saved to: scream_detection_model/")

# Convert to TensorFlow.js format
print("\n🔄 Converting to TensorFlow.js format...")
tfjs.converters.save_keras_model(model, model_dir)
print(f"✅ Saved to: {model_dir}/")

print("\n" + "=" * 60)
print("🎉 MODEL TRAINING COMPLETE!")
print("=" * 60)
print(f"\n📊 Final Results:")
print(f"   Accuracy: {test_accuracy * 100:.2f}%")
print(f"   Model saved to: {model_dir}/")
print(f"\n🚀 Next steps:")
print(f"   1. The trained model is now in public/model/")
print(f"   2. Restart your Next.js app: npm run dev")
print(f"   3. The app will automatically load the trained model!")
print("\n" + "=" * 60)