import React from "react";

export default ({ checked, onChange }) => {
  return (
    <>
      <div className="card processing-card">
        <h3 className="custom-header">Terms of Service</h3>

        <div className="terms-of-service-scroller">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque nostrum
          fuga doloribus maiores mollitia a ut iure corporis illo! Aperiam rem
          quisquam ut ipsa debitis blanditiis mollitia id quae temporibus? Lorem
          ipsum dolor sit amet consectetur adipisicing elit. Perferendis libero
          ipsam nihil quibusdam inventore deleniti quasi qui error neque.
          <br />
          <br />
          Blanditiis voluptas doloribus natus perferendis quis repellendus
          necessitatibus voluptatibus quos minus. Nulla nam sit, nostrum beatae
          dicta iure corrupti atque itaque iusto veritatis ea sed cum tempora
          aspernatur dolores necessitatibus? <br />
          <br />
          Nesciunt quasi ipsum ab quis, neque cum dolor tempore! Voluptates,
          iure.
          <br />
          <br /> Perspiciatis cupiditate quasi eveniet ratione magnam error non
          culpa deleniti aliquid itaque voluptates, ab, unde ullam quia commodi
          distinctio labore enim voluptatem autem est in asperiores impedit nam
          maxime? Ex. Repellat sapiente aliquam ipsa facere dolor laudantium,
          omnis autem deserunt dicta earum adipisci atque obcaecati aspernatur
          hic, porro impedit tempora maiores dignissimos, dolorum deleniti.
          Debitis quam officiis sed voluptatum animi.
          <br />
          <br /> Nostrum tenetur, atque veniam, nisi dolorum assumenda impedit
          consectetur ipsa quod recusandae, aperiam numquam? Molestiae
          distinctio veniam harum iure corporis sunt, doloremque, corrupti illo
          impedit, ipsa similique. Necessitatibus, a aut?
        </div>
        <div className="form-group">
          <label className="form-checkbox">
            <input
              type="checkbox"
              onChange={e => onChange(e)}
              checked={checked}
            />
            <i className="form-icon"></i> I agree to the Terms of Service.
          </label>
        </div>
      </div>
    </>
  );
};
