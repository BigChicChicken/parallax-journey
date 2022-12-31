const updateZoom = (scene, value) => {
    let zoom = Number(scene.style.getPropertyValue("--zoom")) + value;
    if (zoom < 0) {
        zoom = 0;
    } else if (zoom > 10) {
        zoom = 10;
    }

    scene.style.setProperty("--zoom", zoom);
}

window.addEventListener('load', () => {
    const choices = [...document.getElementById('Choice').children];
    choices.forEach((choice) => {
        choice.addEventListener('click', () => {
            const scene = document.getElementById(choice.getAttribute('alt'));
            if (scene) {
                scene.setAttribute('aria-hidden', false);
                scene.style.setProperty("--zoom", 0);
            }
        });
    });

    const scenes = [...document.getElementsByClassName('scene')];
    scenes.forEach((scene) => {    
        const elements = [...scene.getElementsByClassName('back')];
        elements.forEach((element) => {
            element.addEventListener('click', () => {
                scene.setAttribute('aria-hidden', true);
            });
        });

        scene.addEventListener('wheel', ({ wheelDelta }) => {
            updateZoom(scene, Math.sign(wheelDelta));
        });

        let scalingMode = false;
        let scaleStart = null;

        scene.addEventListener('touchstart', ({ touches }) => {
            if (touches.length === 2) {
                scalingMode = true;
                scaleStart = null;
            }
        });

        scene.addEventListener('touchmove', ({ touches }) => {
            if (scalingMode) {
                const [ { pageX: x1, pageY: y1 }, { pageX: x2, pageY: y2 } ] = touches;
                const scale = Math.hypot(x2 - x1, y2 - y1);

                if (!scaleStart) {
                    scaleStart = scale;
                } else {
                    const scroll = Math.round((scale - scaleStart) / 50);
                    if (scroll !== 0) {
                        scaleStart = scale;
                        updateZoom(scene, scroll);
                    }
                }
            }
        });
        
        scene.addEventListener('touchend', ({ touches }) => {
            if (touches.length !== 2) {
                scalingMode = false;
                scaleStart = null;
            }
        });
    });
});