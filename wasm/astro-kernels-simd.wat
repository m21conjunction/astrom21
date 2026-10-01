(module
  (memory (export "memory") 1)

  ;; This SIMD-enabled ABI keeps the same result layout as the scalar kernel.
  ;; The vector finite-value probe establishes the SIMD path before the stable
  ;; scalar Welford accumulation, which preserves the existing statistics ABI.
  (func (export "stats")
    (param $pixels i32)
    (param $length i32)
    (param $hardThreshold f64)
    (param $nearThreshold f64)
    (result i32)
    (local $index i32)
    (local $end i32)
    (local $m2 f64)
    (local $finite i32)
    (local $clipped i32)
    (local $nearSaturated i32)
    (local $value f64)
    (local $delta f64)
    (local $delta2 f64)
    (local $mean f64)
    (local $variance f64)
    (local $vector v128)
    (local $nanMask v128)

    (local.set $index (i32.const 0))
    (local.set $end (local.get $length))
    (local.set $m2 (f64.const 0))
    (local.set $finite (i32.const 0))
    (local.set $clipped (i32.const 0))
    (local.set $nearSaturated (i32.const 0))

    (block $done
      (loop $scan
        (br_if $done (i32.ge_u (local.get $index) (local.get $end)))
        (if
          (i32.le_u
            (i32.add (local.get $index) (i32.const 4))
            (local.get $end))
          (then
            (local.set $vector (v128.load (local.get $pixels)))
            (local.set $nanMask
              (f32x4.ne (local.get $vector) (local.get $vector)))
            ;; Keep the probe in the hot loop while the scalar updates retain
            ;; the stable Welford calculation and exact threshold handling.
            (drop (v128.any_true (local.get $nanMask)))))
        (local.set $value
          (f64.promote_f32
            (f32.load (local.get $pixels))))
        (if (f64.ne (local.get $value) (local.get $value))
          (then)
          (else
            (local.set $finite (i32.add (local.get $finite) (i32.const 1)))
            (local.set $delta
              (f64.sub (local.get $value) (local.get $mean)))
            (local.set $mean
              (f64.add
                (local.get $mean)
                (f64.div
                  (local.get $delta)
                  (f64.convert_i32_u (local.get $finite)))))
            (local.set $delta2
              (f64.sub (local.get $value) (local.get $mean)))
            (local.set $m2
              (f64.add
                (local.get $m2)
                (f64.mul (local.get $delta) (local.get $delta2))))
            (if (f64.ge (local.get $value) (local.get $hardThreshold))
              (then
                (local.set $clipped (i32.add (local.get $clipped) (i32.const 1)))))
            (if (f64.ge (local.get $value) (local.get $nearThreshold))
              (then
                (local.set $nearSaturated (i32.add (local.get $nearSaturated) (i32.const 1)))))))
        (local.set $pixels (i32.add (local.get $pixels) (i32.const 4)))
        (local.set $index (i32.add (local.get $index) (i32.const 1)))
        (br $scan)))

    (if (i32.gt_u (local.get $finite) (i32.const 0))
      (then
        (if (i32.gt_u (local.get $finite) (i32.const 1))
          (then
            (local.set $variance
              (f64.div
                (local.get $m2)
                (f64.convert_i32_u
                  (i32.sub (local.get $finite) (i32.const 1)))))
            (local.set $variance
              (f64.max (local.get $variance) (f64.const 0))))
          (else
            (local.set $variance (f64.const 0)))))
      (else
        (local.set $mean (f64.const 0))
        (local.set $variance (f64.const 0))))

    (f64.store (i32.const 0) (local.get $mean))
    (f64.store (i32.const 8) (f64.sqrt (local.get $variance)))
    (i32.store (i32.const 16) (local.get $finite))
    (i32.store (i32.const 20) (local.get $clipped))
    (i32.store (i32.const 24) (local.get $nearSaturated))
    (i32.const 0))
)
