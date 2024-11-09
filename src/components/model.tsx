import { Ref, useLayoutEffect, useRef } from "react";
import { BufferGeometry, NormalBufferAttributes } from "three";

type Props = {
  vertices: Float32Array;
};

export const Model = ({ vertices }: Props) => {
  const bufferRef = useRef<BufferGeometry<NormalBufferAttributes>>();

  useLayoutEffect(() => {
    if (!bufferRef.current) return;
    bufferRef.current.attributes.position.needsUpdate = true;
    bufferRef.current.computeBoundingBox();
    bufferRef.current.computeBoundingSphere();
    bufferRef.current.computeVertexNormals();
  }, [vertices]);

  if (!vertices) return null;
  if (vertices.length === 0) return null;
  if (vertices.length % 3 !== 0) return null;

  return (
    <mesh
      castShadow
      receiveShadow
      position={[0, 0.1, 0]}
      scale={[0.01, 0.01, 0.01]}
    >
      <bufferGeometry
        ref={
          bufferRef as Ref<BufferGeometry<NormalBufferAttributes>> | undefined
        }
      >
        <bufferAttribute
          attach="attributes-position"
          array={vertices}
          count={vertices.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <meshStandardMaterial metalness={0.5} roughness={0.2} />
    </mesh>
  );
};
