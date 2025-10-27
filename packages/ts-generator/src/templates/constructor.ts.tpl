constructor(private tasks: Tasks) {
  super(EStep.{{startStep}}, {
    withAuditLog: true,
  });

  Object.values(EStep).map((step) =>
    this.stepHandler.set(step, this[step].bind(this))
  );
}