export class GameLoop {
    constructor(update, render) {
        this.lastTime = 0;
        this.accumulatedTime = 0;
        this.deltaTime = 1 / 60; // Target 60 FPS
        this.isRunning = false;
        this.animationFrameId = null;

        // User defined callbacks
        this.update = update;
        this.render = render;
    }

    loop = (timestamp) => {
        if (!this.isRunning) return;

        if (this.lastTime === 0) {
            this.lastTime = timestamp;
        }

        const elapsed = (timestamp - this.lastTime) / 1000; // Convert to seconds
        this.lastTime = timestamp;

        this.accumulatedTime += elapsed;

        // Update logic in fixed steps if needed, or just pass elapsed time
        // For simplicity in this base class, we'll just pass the actual elapsed time (variable time step)
        // or we could implement fixed time step. Let's stick to variable for simple smooth animations first
        // effectively implementing "update" every frame.

        if (this.update) {
            this.update(elapsed);
        }

        if (this.render) {
            this.render(); // Render usually just draws current state
        }

        this.animationFrameId = requestAnimationFrame(this.loop);
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.lastTime = 0;
        this.animationFrameId = requestAnimationFrame(this.loop);
    }

    stop() {
        this.isRunning = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
    }
}
